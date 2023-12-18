# Importing necessary libraries
import os
import sys
import json
import datetime

# Define a function
def greet_user(name):
    current_time = datetime.datetime.now()
    greeting = f"Hello, {name}! Current time is {current_time}."
    return greeting

# Main function
def main():
    user_name = input("Please enter your name: ")
    greeting = greet_user(user_name)
    print(greeting)

# Call the main function
if __name__ == "__main__":
    main()