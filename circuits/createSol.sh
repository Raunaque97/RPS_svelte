#!/usr/bin/env bash

# set the target folder where the .zkey files are located
target_folder="../public"

sol_target_folder="../contracts/verifiers"

# create sol_target_folder if it doesn't exist
mkdir -p "$sol_target_folder"

# iterate over all .zkey files in the target folder
for file in "$target_folder"/*.zkey; do
    filename=$(basename "$file" ".zkey")
    # create solidity verifier
    snarkjs zkey export solidityverifier "$file"  "$sol_target_folder/""$filename"Verifier.sol

    # print the progress 
    echo "$filename" "done"
done
