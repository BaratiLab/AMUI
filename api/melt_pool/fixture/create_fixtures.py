import csv
import json

files = ["classification", "geometry"]

file_headers = []

# Combines csv files into one.
for file in files:
    with open(f"{file}.csv", "r") as csv_file:
        csv_reader = csv.reader(csv_file)

        # Assuming the first row contains column headers, you can skip it
        file_headers += next(csv_reader, None)
        print(len(next(csv_reader, None)))

print(len(file_headers))

file_headers_union = list(set(file_headers))

data = []

for file in files:

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

    with open(f"{file}.csv", "r") as csv_file:
        csv_reader = csv.reader(csv_file)

        # Assuming the first row contains column headers, you can skip it
        headers = next(csv_reader, None)

        for row_number, row in enumerate(csv_reader, start=1):
            # Create a dictionary with keys as column headers and values as row values
            row_data = {}

            row_data["fields"] = {
                # Initializes object to include union of headers.
                file_headers_union[i]: None
                for i in range(len(file_headers_union))
            }
            row_data["fields"]["record_type"] = file

            for i in range(len(headers)):
                row_data["fields"][headers[i]] = convert_value(row[i])

            row_data["model"] = f"melt_pool.Record"
            row_data["pk"] = row_number

            # Add row number as a key to the dictionary
            data.append(row_data)

        print(row_number)

print(len(data))

# Convert the list of dictionaries into a JSON object
json_object = json.dumps(data, indent=2)

# Write the JSON object to a file
with open(f"records.json", "w") as json_file:
    json_file.write(json_object)
