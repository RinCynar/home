import re
import os

def extract_css(html_path, css_path):
    print(f"Processing {html_path}...")
    with open(html_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Find style block
    match = re.search(r'<style>(.*?)</style>', content, re.DOTALL)
    if not match:
        print("No <style> block found.")
        return

    css_content = match.group(1)
    
    # Simple cleanup: Remove :root block if it exists, since we defined it in material-you.css
    # But checking for :root is tricky because of multiple definitions.
    # Let's just comment out the :root block in the extracted CSS or let it be overridden.
    # To be safe, we append it.
    
    print(f"Extracted {len(css_content)} characters of CSS.")

    with open(css_path, 'a', encoding='utf-8') as f:
        f.write("\n/* --- Extracted from HTML --- */\n")
        f.write(css_content)
    
    # Remove style block from HTML
    new_html = content.replace(match.group(0), '')
    
    # Save new HTML
    new_html_path = html_path # Overwrite? Better to backup?
    # We will overwrite for now as we have git (hopefully) or we can just write to a temp file first.
    # The user instruction implies modifying the project. I'll write to the same file.
    with open(html_path, 'w', encoding='utf-8') as f:
        f.write(new_html)
    
    print(f"Updated {html_path}")

base_dir = r"d:\RinCynar\Documents\Code\home"
extract_css(os.path.join(base_dir, "index.html"), os.path.join(base_dir, "assets", "material-you.css"))
extract_css(os.path.join(base_dir, "contact.html"), os.path.join(base_dir, "assets", "material-you.css"))
