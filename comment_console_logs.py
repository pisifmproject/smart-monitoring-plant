import os
import re
from pathlib import Path

def comment_console_logs(file_path):
    """Comment out console.log, console.error, console.warn, console.debug, console.info"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        original_content = content
        
        # Pattern untuk menangkap console statements (single line atau multiline)
        # Match console.log/error/warn/debug/info(...) termasuk yang multiline
        patterns = [
            # Single line console statements
            (r'^(\s*)(console\.(log|error|warn|debug|info)\([^;]*\);?\s*)$', r'\1// \2'),
            # Console statements di dalam function
            (r'([ \t]+)(console\.(log|error|warn|debug|info)\([^;]*\);?\s*)$', r'\1// \2'),
        ]
        
        lines = content.split('\n')
        new_lines = []
        i = 0
        
        while i < len(lines):
            line = lines[i]
            
            # Check if line contains console statement
            if re.search(r'\bconsole\.(log|error|warn|debug|info)\(', line):
                # Check if it's already commented
                if not re.match(r'^\s*//', line):
                    # Get indentation
                    indent = re.match(r'^(\s*)', line).group(1)
                    
                    # If console statement is complete on this line
                    if ');' in line or line.rstrip().endswith(')'):
                        new_lines.append(f'{indent}// {line.lstrip()}')
                        i += 1
                        continue
                    else:
                        # Multiline console statement
                        console_lines = [line]
                        i += 1
                        
                        # Collect all lines until we find the closing parenthesis
                        while i < len(lines):
                            console_lines.append(lines[i])
                            if ');' in lines[i] or lines[i].rstrip().endswith(')'):
                                i += 1
                                break
                            i += 1
                        
                        # Comment out all collected lines
                        for console_line in console_lines:
                            line_indent = re.match(r'^(\s*)', console_line).group(1)
                            new_lines.append(f'{line_indent}// {console_line.lstrip()}')
                        continue
                else:
                    new_lines.append(line)
                    i += 1
                    continue
            else:
                new_lines.append(line)
                i += 1
        
        new_content = '\n'.join(new_lines)
        
        # Only write if content changed
        if new_content != original_content:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(new_content)
            return True
        return False
    except Exception as e:
        print(f"Error processing {file_path}: {e}")
        return False

def process_directory(root_dir, extensions=['.vue', '.ts']):
    """Process all files in directory with given extensions"""
    root_path = Path(root_dir)
    modified_count = 0
    
    for ext in extensions:
        for file_path in root_path.rglob(f'*{ext}'):
            # Skip .js files as they are compiled
            if file_path.suffix == '.js':
                continue
            
            print(f"Processing: {file_path}")
            if comment_console_logs(str(file_path)):
                modified_count += 1
                print(f"  ✓ Modified")
            else:
                print(f"  - No changes")
    
    return modified_count

if __name__ == "__main__":
    frontend_dir = r"c:\Users\netcom\Documents\ifm_septian\project\PISIFM\pisifmfe\frontend\src"
    
    print("Starting to comment out console statements...")
    print(f"Target directory: {frontend_dir}\n")
    
    modified = process_directory(frontend_dir, ['.vue', '.ts'])
    
    print(f"\n✅ Done! Modified {modified} files")
