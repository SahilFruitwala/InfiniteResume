import re

with open('app/components/Sidebar.tsx', 'r') as f:
    content = f.read()

# For LeftSidebar
left_content = content.replace("export const Sidebar = (", "export const LeftSidebar = (")
# Remove Theme, Typography, Spacing, Layout accordions
# Using a simple block removal logic
start_theme = left_content.find('<AccordionItem title="Theme & Colors">')
end_layout = left_content.find('<AccordionItem title="Personal Information"', start_theme)
left_content = left_content[:start_theme] + left_content[end_layout:]

with open('app/components/LeftSidebar.tsx', 'w') as f:
    f.write(left_content)

# For RightSidebar
# Since it's quite different, let's create it from scratch by copying the top part and sticking the Theme/Layout stuff in.
