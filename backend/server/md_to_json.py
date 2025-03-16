import re
import os 
import json

def regex_match(input_str, regex):
    return re.match(regex, input_str)
    
choice_idx = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"

import json
import re

def parse_question(text):

    
    text = remove_pattern(text)
    result = {
        "question": "",
        "choices": {},
        "answer": [],
        "explanation": ""
    }
    
    
    import re
    choice_pattern = r'- ([A-Z])\.\s+(.*?)(?=\s+- [A-Z]\.|<details|\Z)'
    choices_matches = re.findall(choice_pattern, text, re.DOTALL)
    
    
    for letter, choice_text in choices_matches:
        result["choices"][letter] = choice_text.strip()
    
    
    first_choice_index = text.find("- A.")
    if first_choice_index == -1:  
        for letter in "ABCDEFGHIJKLMNOPQRSTUVWXYZ":
            pattern = f"- {letter}."
            index = text.find(pattern)
            if index != -1:
                first_choice_index = index
                break
    
    if first_choice_index != -1:
        result["question"] = text[:first_choice_index].strip()
    
    
    answer_pattern1 = r'Correct Answer:\s+([A-Z]+)'
    answer_pattern2 = r'Correct answer:\s+([A-Z]+)'
    answer_match1 = re.search(answer_pattern1, text)
    answer_match2 = re.search(answer_pattern2, text)
    if answer_match1:
        answer_text = answer_match1.group(1).strip()
        
        if ',' in answer_text:
            result["answer"] = [letter.strip() for letter in answer_text.split(',')]
        
        elif len(answer_text) > 1:
            result["answer"] = list(answer_text)
        else:
            result["answer"] = [answer_text]
    elif(re.search(answer_pattern2, text)):
        answer_text = answer_match2.group(1).strip()
        
        if ',' in answer_text:
            result["answer"] = [letter.strip() for letter in answer_text.split(',')]
        
        elif len(answer_text) > 1:
            result["answer"] = list(answer_text)
        else:
            result["answer"] = [answer_text]
            
    
    explanation_pattern = r'Explanation:\s+(.*?)(?=<\/details>|\Z)'
    explanation_match = re.search(explanation_pattern, text, re.DOTALL)
    if explanation_match:
        result["explanation"] = explanation_match.group(1).strip()
    
    return result

def remove_pattern(text):
    
    pattern = r"---\s*layout:\s*exam\s*---\s*

    
    if re.search(pattern, text):
        text = re.sub(pattern, "", text).strip()  

    return text


def extract_questions_and_answers(file_path):
    
    with open(file_path, 'r') as file:
        content = file.read()
        
    lines = content.split("\n")
    all = " ".join(lines).split("</details>")
    questions = []
    for question in all: 
        if(question == ""):
            continue
        else:
            resp = parse_question(question)
            questions.append(resp)
    return questions

def save_json(file_path,data):
    json_data = json.dumps(data, indent=4)  
    with open(file_path, "w") as file:
        file.write(json_data)
        
i=1

for file_path in os.listdir("../exams/AWS-CCP/md_exams"):
    if(file_path.endswith(".md")):
        started_path = f"../exams/AWS-CCP/md_exams/{file_path}"
        extracted_data = extract_questions_and_answers(started_path)
        new_name = f"../exams/AWS-CCP/json_exams/Practice_Exam_{i}.json"
        save_json(new_name,extracted_data)
        print(f"Started with: {started_path} Saved to {new_name}")
        i+=1



