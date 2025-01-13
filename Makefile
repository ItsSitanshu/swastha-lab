PYTHON := python3

SRC_DIR := src

SETUP_SCRIPT := $(SRC_DIR)/setup.py
PROCESSING_SCRIPT := $(SRC_DIR)/processing.py
MAIN_SCRIPT := $(SRC_DIR)/main.py
TEST_SCRIPT := $(SRC_DIR)/test.py


REQUIREMENTS_FILE := requirements.txt

.PHONY: setup train test create-venv activate-venv install-packages deactivate-venv

setup:
	$(PYTHON) $(SETUP_SCRIPT)
	$(PYTHON) $(PROCESSING_SCRIPT)

train:
	$(PYTHON) $(MAIN_SCRIPT)

test:
	$(PYTHON) $(TEST_SCRIPT)

create-venv:
	$(PYTHON) -m venv $(VENV_DIR)

activate-venv:
	@echo "To activate the virtual environment, run:"
	@echo "Windows: $(VENV_DIR)\Scripts\activate"
	@echo "macOS/Linux: source $(VENV_DIR)/bin/activate"

install-packages:
	$(VENV_DIR)/bin/pip install -r $(REQUIREMENTS_FILE)

deactivate-venv:
	@echo "To deactivate the virtual environment, run:"
	@echo "deactivate"