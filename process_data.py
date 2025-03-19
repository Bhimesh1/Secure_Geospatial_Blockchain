import os
import sys

# Add the project root directory to the Python path
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
sys.path.append(BASE_DIR)

# Import the data processing module
from backend.data_processing.extract_data import extract_geospatial_data

if __name__ == "__main__":
    print("Starting data processing pipeline...")

    # Extract and process the geospatial data
    processed_data = extract_geospatial_data()

    if processed_data is not None:
        print("\nData processing completed successfully!")
        print(f"Total records processed: {len(processed_data)}")
    else:
        print("\nData processing failed. Check the error messages above.")