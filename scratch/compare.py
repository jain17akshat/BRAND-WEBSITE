import pandas as pd
import json
import re

excel_path = r'e:\Brand website\S_listing--ui--group_096e58cf19cd42d6_0510-170818_default.xls'

# Read excel file
try:
    df = pd.read_excel(excel_path)
except Exception as e:
    print("Pandas read_excel failed:", e)
    # try xlrd or openpyxl
    import xlrd
    wb = xlrd.open_workbook(excel_path)
    sheet = wb.sheet_by_index(0)
    data = []
    for r in range(sheet.nrows):
        data.append(sheet.row_values(r))
    df = pd.DataFrame(data[1:], columns=data[0])

print("Excel Columns:", df.columns.tolist())
print("Excel Total Rows:", len(df))
print("\nFirst 3 rows:")
print(df.head(3).to_dict(orient='records'))
