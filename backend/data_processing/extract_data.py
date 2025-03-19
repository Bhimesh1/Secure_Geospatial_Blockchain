import pandas as pd
import os
import json

# Create the datasets directory path
BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
DATASET_DIR = os.path.join(BASE_DIR, 'datasets')


def extract_geospatial_data():
    """
    Extract geospatial data from Addresses.xlsx and convert to CSV and JSON formats
    """
    print("Extracting geospatial data...")

    # Read Excel file
    excel_path = os.path.join(DATASET_DIR, 'addresses.xlsx')
    try:
        df = pd.read_excel(excel_path)
        print(f"Successfully read {excel_path}")
    except FileNotFoundError:
        print(f"Error: {excel_path} not found")
        return
    except Exception as e:
        print(f"Error reading Excel file: {str(e)}")
        return

    # Display the first few rows and column names
    print("\nDataset Overview:")
    print(f"Columns: {df.columns.tolist()}")
    print(f"Shape: {df.shape}")
    print("\nSample Data:")
    print(df.head())

    # Clean the data
    df_cleaned = clean_data(df)

    # Save to CSV
    csv_path = os.path.join(DATASET_DIR, 'processed_data.csv')
    df_cleaned.to_csv(csv_path, index=False)
    print(f"\nSaved cleaned data to CSV: {csv_path}")

    # Convert to JSON
    json_path = os.path.join(DATASET_DIR, 'formatted_data.json')
    convert_to_json(df_cleaned, json_path)
    print(f"Saved formatted data to JSON: {json_path}")

    return df_cleaned


def clean_data(df):
    """
    Clean and validate the geospatial data
    """
    print("\nCleaning and validating data...")

    # Make a copy to avoid modifying the original
    df_clean = df.copy()

    # Check for missing values
    missing_values = df_clean.isnull().sum()
    print(f"Missing values per column:\n{missing_values}")

    # Drop duplicates if any
    initial_rows = len(df_clean)
    df_clean = df_clean.drop_duplicates()
    dropped_rows = initial_rows - len(df_clean)
    print(f"Dropped {dropped_rows} duplicate rows")

    # Handle missing values (if any)
    # For this example, we'll drop rows with missing latitude or longitude
    if 'latitude' in df_clean.columns and 'longitude' in df_clean.columns:
        df_clean = df_clean.dropna(subset=['latitude', 'longitude'])
        print(f"Dropped rows with missing lat/long coordinates")

    # Validate latitude and longitude ranges if they exist
    if 'latitude' in df_clean.columns:
        # Latitude should be between -90 and 90
        invalid_lat = df_clean[(df_clean['latitude'] < -90) | (df_clean['latitude'] > 90)].index
        if len(invalid_lat) > 0:
            print(f"Warning: {len(invalid_lat)} rows have invalid latitude values")
            df_clean = df_clean.drop(invalid_lat)

    if 'longitude' in df_clean.columns:
        # Longitude should be between -180 and 180
        invalid_lon = df_clean[(df_clean['longitude'] < -180) | (df_clean['longitude'] > 180)].index
        if len(invalid_lon) > 0:
            print(f"Warning: {len(invalid_lon)} rows have invalid longitude values")
            df_clean = df_clean.drop(invalid_lon)

    print(f"Final dataset shape after cleaning: {df_clean.shape}")
    return df_clean


def convert_to_json(df, output_path):
    """
    Convert the cleaned DataFrame to a structured JSON format
    """
    # Convert DataFrame to a list of records
    records = df.to_dict(orient='records')

    # Create a structured JSON object
    json_data = {
        "metadata": {
            "count": len(records),
            "generated_at": pd.Timestamp.now().isoformat(),
            "columns": df.columns.tolist()
        },
        "data": records
    }

    # Write to JSON file
    with open(output_path, 'w') as f:
        json.dump(json_data, f, indent=2)


if __name__ == "__main__":
    # Make sure the datasets directory exists
    os.makedirs(DATASET_DIR, exist_ok=True)

    # Extract and process data
    extract_geospatial_data()