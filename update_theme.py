import os
import re

def update_file(filepath):
    with open(filepath, 'r') as f:
        content = f.read()

    # Color palette replacements
    replacements = {
        r'bg-slate-50\b': 'bg-[#ECFEFF]',
        r'text-slate-900\b': 'text-[#164E63]',
        r'text-slate-800\b': 'text-[#164E63]/90',
        r'text-slate-700\b': 'text-[#164E63]',
        r'text-slate-600\b': 'text-[#164E63]/70',
        r'text-slate-500\b': 'text-[#164E63]/60',
        r'text-slate-400\b': 'text-[#164E63]/40',
        r'bg-blue-50\b': 'bg-cyan-50',
        r'bg-blue-100\b': 'bg-cyan-100',
        r'text-blue-500\b': 'text-[#0891B2]',
        r'text-blue-600\b': 'text-[#0891B2]',
        r'text-blue-700\b': 'text-[#0891B2]',
        r'bg-blue-600\b': 'bg-[#059669]',
        r'bg-blue-700\b': 'bg-[#059669]',
        r'hover:bg-blue-700\b': 'hover:bg-emerald-700',
        r'hover:bg-blue-800\b': 'hover:bg-emerald-700',
        r'border-slate-100\b': 'border-cyan-50',
        r'border-slate-200\b': 'border-cyan-100',
        r'border-slate-300\b': 'border-cyan-200',
        r'hover:border-slate-300\b': 'hover:border-cyan-200',
        r'ring-blue-500\b': 'ring-[#0891B2]',
        r'focus:ring-blue-500\b': 'focus:ring-[#0891B2]',
        
        # Structural minimalism: remove border radii for sharper look
        r'rounded-2xl\b': 'rounded-none',
        r'rounded-xl\b': 'rounded-none',
        r'rounded-lg\b': 'rounded-none',
        
        # Adjust shadows to be lighter or removed
        r'shadow-sm\b': 'shadow-none border border-cyan-100',
    }

    new_content = content
    for pattern, replacement in replacements.items():
        new_content = re.sub(pattern, replacement, new_content)

    if new_content != content:
        with open(filepath, 'w') as f:
            f.write(new_content)
        print(f"Updated {filepath}")

for root, _, files in os.walk('client/src'):
    for file in files:
        if file.endswith('.tsx'):
            # Don't overwrite the ExecutiveDashboard which is already perfect
            if file == 'ExecutiveDashboard.tsx':
                continue
            update_file(os.path.join(root, file))

print("Done.")
