#!/bin/bash

set -e
set -x

# install node dependencies in subdirectories
cd frontend && npm install && npm npm run dev && cd .. &&

# install python dependencies in subdirectories
poetry config virtualenvs.in-project true &&
cd backend && poetry env use python3.11 && poetry install --no-root && uvicorn main:app --reload && cd ..

exit 0
