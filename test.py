
# Python program to read
# json file
  
  
import json
  
# Opening JSON file
f = open('trial_data.json')
  
# returns JSON object as 
# a dictionary
data = json.load(f)
  
# Iterating through the json
# list
#for i in data:
#    print(i)
for i in data['resolver']:
    if i["name"]=="Veena":
        print(i["empid"])
        print(i["email"])
  
# Closing file
f.close()