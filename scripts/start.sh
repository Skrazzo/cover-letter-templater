#!/bin/bash

# Load variables
source ./var.sh

cd .. && docker compose -f $file up -d --build
