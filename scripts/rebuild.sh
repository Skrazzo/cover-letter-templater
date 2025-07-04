#!/bin/bash

# Load variables
source ./var.sh

cd .. && docker compose -f $file down && docker compose -f $file up --build -d
