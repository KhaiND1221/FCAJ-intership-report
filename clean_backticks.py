
import os, glob

base_path = r'E:\FCAJ_REPORT\KhaiND-intership-report\content\workshop'
md_files = glob.glob(os.path.join(base_path, '**', '*.md'), recursive=True)

target_link = '![Architecture Diagram](/FCAJ-intership-report/workshop-images/4.1-Workshop-overview/architect_v3.drawio.png)'

for file in md_files:
    try:
        with open(file, 'r', encoding='utf-8') as f:
            content = f.read()
    except:
        continue
    
    # We want to replace any number of backticks around the target link
    # The backtick character is chr(96)
    bt = chr(96)
    
    # Simple strategy: just do a string replace for all known backtick wrappers
    new_content = content
    for i in range(5, 0, -1):
        wrapper = bt * i
        bad_text = wrapper + target_link + wrapper
        new_content = new_content.replace(bad_text, target_link)
        
    if new_content != content:
        with open(file, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print('Cleaned in ' + file)

