# V1 - JAN/13/2025

import os
import requests
import subprocess
from tqdm import tqdm

DATA_DIR = "data"

def install_dependencies():
  try:
    import py7zr
    print("Dependencies are already installed.")
  except ImportError:
    print("Installing missing dependencies...")
    subprocess.check_call(["pip", "install", "py7zr"])
    print("Dependencies installation complete.")

install_dependencies()
import py7zr

urls = {
  "im_Superficial-Intermediate.7z": "https://www.cse.uoi.gr/~marina/SIPAKMED/im_Superficial-Intermediate.7z",
  "im_Parabasal.7z": "https://www.cse.uoi.gr/~marina/SIPAKMED/im_Parabasal.7z",
  "im_Koilocytotic.7z": "https://www.cse.uoi.gr/~marina/SIPAKMED/im_Koilocytotic.7z",
  "im_Metaplastic.7z": "https://www.cse.uoi.gr/~marina/SIPAKMED/im_Metaplastic.7z",
  "im_Dyskeratotic.7z": "https://www.cse.uoi.gr/~marina/SIPAKMED/im_Dyskeratotic.7z",
}

def download_file(filename, url):
  if not os.path.exists(filename):
    print(f"{filename} not found. Downloading...")
    response = requests.get(url, stream=True)
    total_size = int(response.headers.get("content-length", 0))
    with open(filename, "wb") as file, tqdm(
      desc=filename,
      total=total_size,
      unit="B",
      unit_scale=True,
      unit_divisor=1024,
    ) as bar:
      for chunk in response.iter_content(chunk_size=8192):
        file.write(chunk)
        bar.update(len(chunk))
    print(f"Download complete: {filename}")
  else:
    print(f"{filename} already exists. Skipping download.")

def extract_file(filename, extract_to):
  if not os.path.exists(extract_to):
    os.makedirs(extract_to)
  print(f"Extracting {filename} to {extract_to}...")
  with py7zr.SevenZipFile(filename, mode='r') as archive:
    archive.extractall(path=extract_to)
  print(f"Extraction complete: {extract_to}")
  os.remove(filename)
  print(f"Removed archive: {filename}")

for filename, url in urls.items():
  download_file(filename, url)
  extract_file(filename, DATA_DIR + '/pool')