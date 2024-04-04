#!/bin/bash

# Create a virtual environment
python3 -m venv env

# Activate the virtual environment
source env/bin/activate

# Upgrade pip
pip install --upgrade pip

# Install the packages from requirements.txt
pip install -r requirements.txt

