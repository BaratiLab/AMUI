import csv
import json

def convert_value(value):
    if value == "":
        return None
    # Attempt to convert the value to integer or float, fallback to string if unsuccessful
    try:
        return int(value)
    except ValueError:
        try:
            return float(value)
        except ValueError:
            return value

data = []

with open("material.csv", "r") as csv_file:
    csv_reader = csv.reader(csv_file)

    # Assuming the first row contains column headers, you can skip it
    headers = next(csv_reader, None)

    for row_number, row in enumerate(csv_reader, start=1):
        # Create a dictionary with keys as column headers and values as row values
        row_data = {}

        row_data["fields"] = {}

        for i in range(len(headers)):
            row_data["fields"][headers[i]] = convert_value(row[i])

        row_data["model"] = f"material.Material"
        row_data["pk"] = row_number

        # Add row number as a key to the dictionary
        data.append(row_data)

    print(row_number)

print(len(data))

# Convert the list of dictionaries into a JSON object
json_object = json.dumps(data, indent=2)

# Write the JSON object to a file
with open(f"material.json", "w") as json_file:
    json_file.write(json_object)
