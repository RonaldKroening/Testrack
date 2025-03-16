import json
import os
import json 

def adj(obj):
    option_key = "options"
    new_obj = {}
    arr = obj[option_key]
    new_d = {}
    new_obj["question"] = obj["question"]
    alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    ans = ""
    for i, item in enumerate(arr):
        new_d[alphabet[i]] = item
        if(item == obj['answer']):
            ans = alphabet[i]
    new_obj["choices"] = new_d
    new_obj["answer"] = [ans]
    new_obj["explanation"] = obj["explanation"]
    return new_obj
    
            
        
        
    
def load_json_from_file(file_path):
    try:
        with open(file_path, 'r') as file:
            data = json.load(file)
            return data
    except FileNotFoundError:
        raise FileNotFoundError(f"The file '{file_path}' does not exist.")
    except json.JSONDecodeError:
        raise ValueError(f"The file '{file_path}' is not valid JSON.")

def save_json_to_file(data, filename):
    with open(filename, 'w') as file:
        json.dump(data, file, indent=4) 
        
        
def fix_object(arr):
    new_ret = []
    for question_obj in arr:
        new_obj = adj(question_obj)
        new_ret.append(new_obj)
    return new_ret

file_test = "questions.json"
loaded_json = load_json_from_file(file_test)
new_json = fix_object(loaded_json)
print(f"Size: {len(new_json)}")

f_size = len(new_json) // 4
i = 0
objs = []
file_counter = 1  # Counter for naming files

while i < len(new_json):
    objs.append(new_json[i])
    
    # Save and reset when the chunk size is reached
    if (i + 1) % f_size == 0:
        name = f"Practice_Exam_{file_counter}.json"
        save_json_to_file(objs, name)
        objs = []
        file_counter += 1
    
    i += 1

# Save any remaining objects
if objs:
    name = f"Practice_Exam_{file_counter}.json"
    save_json_to_file(objs, name)
        
    