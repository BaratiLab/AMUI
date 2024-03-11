import React, { useState } from 'react';
import { Radio, FormControlLabel, RadioGroup, Button } from '@mui/material';


interface CheckboxItem {
  label: string;
  score: number;
}

const complexityItems: CheckboxItem[] = [
  { label: 'There are interior features or surface curvature is too complex to be machined', score: 1 },
  { label: 'The part curvature is complex (splines or arcs) for a machining operation such as a mill or lathe', score: 2 },
  { label: 'The part can be made using  a mill or lathe but only after repositioning in the clamp atleast once', score: 3 },
  { label: 'The part is mostly 2D and can be made in a mill or lathe without repositioning it in the clamp', score: 4 },
  { label: 'The part is the same shape as common stock materials, or is completely 2D', score: 5 }
  // ... Add other complexity items
];

const functionalityItems: CheckboxItem[] = [
  { label: 'Surfaces are purely non- functional or experience virtually no cycles', score: 1 },
  { label: 'Mating surfaces will move minimally, experience low forces, or are intended to endure 2-10 cycles', score: 2 },
  { label: 'Mating surfaces move somewhat, experience moderate forces, or are expected to last 10- 100 cycles', score: 3 },
  { label: 'Mating surfaces move significantly, experience large *forces, or must endure 100-1000 cycles.', score: 4 },
  { label: 'Mating surfaces are bearing surfaces, or are expecteed to endure for 1000+ of cycles', score: 5}
  // ... Add other functionality items
];

// Define other categories with placeholder items similarly
const materialRemovalItems: CheckboxItem[] = [
  { label: 'There are no internal cavities, channels, or holes', score: 1 },
  { label: 'Material can be easily removed from internal cavities, channels, or holes', score: 2 },
  { label: 'Internal cavities, channels, or holes do not have openings for removing materials', score: 3 },
  { label: 'There are small gaps that will require support structures', score: 4 },
  { label: 'The part is smaller than or the same size as the required support structure', score: 5}
  // ... Add material removal items
];

const unsupportedFeaturesItems: CheckboxItem[] = [
  { label: 'Part is oriented so there are no overhanging features', score: 1 },
  { label: 'Overhanging features have a minimum of 45deg support', score: 2 },
  { label: 'Overhang features have a slopped support', score: 3 },
  { label: 'There are short, unsupported features', score: 4 },
  { label: 'There are long, unsupported features', score: 5}
  // ... Add unsupported features items
];

const thinfeatures: CheckboxItem[] = [
  { label: 'Walls are more than 1/8" (3mm) thick', score: 1 },
  
  { label: 'Walls are between 1/16" (1.5mm) and 1/8" (3mm) thick', score: 3 },
 
  { label: 'Some walls are less than 1/16"(1.5mm) thick', score: 5}
  // ... Add unsupported features items
];

const stressconcentration: CheckboxItem[] = [
  { label: 'Interior corners have generous chamfers, fillets, and/or ribs', score: 1 },
  
  { label: 'Interior corners have chamfers, fillets, and/or ribs', score: 3 },
 
  { label: 'Interior corners have no chamfers, fillets, and/or ribs', score: 5}
  // ... Add unsupported features items
];

const tolerances: CheckboxItem[] = [
  { label: 'Hole and length tolerances are considered or are not important', score: 1 },
  
  { label: 'Hole or length tolerances are adjusted for shrinkage or fit', score: 3 },
 
  { label: 'Hole or length dimensions are nominal', score: 5}
  // ... Add unsupported features items
];

const geometricexactness: CheckboxItem[] = [
  { label: 'The part has small or no flat surfaces, or forms that need to be exact', score: 1 },
  
  { label: 'The part has medium-sized, flat surfaces, or forms that are should be close to exact', score: 3 },
 
  { label: 'The part has large, flat surfaces or has a form that is important to be exact', score: 5}
  // ... Add unsupported features items
];

const Worksheet = () => {
  const [selectedScores, setSelectedScores] = useState<{ [category: string]: number }>({});

  const handleRadioChange = (event: React.ChangeEvent<HTMLInputElement>, category: string) => {
    setSelectedScores((prevSelectedScores) => ({
      ...prevSelectedScores,
      [category]: parseInt(event.target.value, 10),
    }));
  };

  const resetCategorySelection = (category: string) => {
    setSelectedScores((prevSelectedScores) => {
      const newScores = { ...prevSelectedScores };
      delete newScores[category]; // Remove the score for the category
      return newScores;
    });
  };

  const resetAllSelections = () => {
    setSelectedScores({});
  };

  const interpretTotalScore = (totalScore: number) => {
    if (totalScore >= 33 && totalScore <= 40) {
      return 'Needs redesign';
    } else if (totalScore >= 24 && totalScore <= 32) {
      return 'Consider redesign';
    } else if (totalScore >= 16 && totalScore <= 23) {
      return 'Moderate likelihood of success';
    } else if (totalScore >= 8 && totalScore <= 15) {
      return 'Higher likelihood of success';
    } else {
      return 'Score out of expected range. Please ensure all categories are evaluated correctly.';
    }
  };



  const calculateTotalScore = () => {
    return Object.values(selectedScores).reduce((total, score) => total + score, 0);
  };

  // A helper function to render categories with radio buttons
  const renderCategory = (categoryItems: CheckboxItem[], categoryName: string) => (
    <div>
      <h2>{categoryName}</h2>
      <RadioGroup
        name={categoryName}
        value={selectedScores[categoryName] ? selectedScores[categoryName].toString() : ''}
        onChange={(event) => handleRadioChange(event, categoryName)}
      >
        {categoryItems.map((item, index) => (
          <FormControlLabel 
            key={`${categoryName}-${index}`} 
            value={item.score.toString()} 
            control={<Radio />} 
            label={item.label} 
          />
        ))}
      </RadioGroup>
      <Button variant="outlined" onClick={() => resetCategorySelection(categoryName)}>Reset {categoryName}</Button>
    </div>
  );
  return (
    <div>
      <h1>Design for Additive Manufacturing Worksheet</h1>
      <Button variant="contained" onClick={resetAllSelections} style={{marginTop: '20px'}}>Reset All</Button>
      <form>
        {renderCategory(complexityItems, 'Complexity')}
        {renderCategory(functionalityItems, 'Functionality')}
        {renderCategory(materialRemovalItems, 'Material Removal')}
        {renderCategory(unsupportedFeaturesItems, 'Unsupported Features')}
        {renderCategory(thinfeatures, 'Thin Features')}
        {renderCategory(stressconcentration, 'Stress Concentration')}
        {renderCategory(tolerances, 'Tolerances')}
        {renderCategory(geometricexactness, 'Geometric Exactness')}
        {/* Render other categories similarly */}

        <div>
          <h2>Total Score</h2>
          <p>{calculateTotalScore()}</p>
          <p>{interpretTotalScore(calculateTotalScore())}</p>
        </div>
        <Button variant="contained" onClick={resetAllSelections} style={{marginTop: '20px'}}>Reset All</Button>
      </form>
    </div>
  );
};

export default Worksheet;
