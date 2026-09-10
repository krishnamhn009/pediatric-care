import os
import re

replacements = {
    r'rounded-3xl': 'rounded-none',
    r'rounded-full': 'rounded-none',
    r'border border-cyan-100 border border-cyan-100': 'border border-cyan-100',
    r'shadow-none border border-cyan-100 border border-cyan-100': 'border border-cyan-100',
    r'hover:bg-blue-500': 'hover:bg-emerald-700',
    r'from-blue-900 via-blue-800 to-indigo-900': 'from-[#0891B2] to-[#059669]',
    r'shadow-xl shadow-blue-600/30': 'shadow-md',
    r'shadow-md shadow-blue-600/25': 'shadow-md',
    r'text-blue-200': 'text-cyan-100',
    r'text-blue-100': 'text-cyan-50',
    r'text-blue-300': 'text-cyan-200',
    r'bg-blue-500/20': 'bg-cyan-500/20',
    r'border-blue-400/30': 'border-cyan-400/30',
    r'ring-blue-400': 'ring-cyan-400',
    r'border-blue-400': 'border-cyan-400',
    r'bg-blue-400/10': 'bg-cyan-400/10',
    r'text-blue-400': 'text-[#0891B2]',
    r'border-blue-200': 'border-cyan-200',
    r'bg-[#059669]/10 text-[#0891B2]': 'bg-cyan-100 text-[#0891B2]',
    r'border-b border-cyan-50 dark:border-slate-800': 'border-b border-cyan-100',
    r'font-display text-2xl sm:text-3xl font-extrabold text-[#164E63] dark:text-white mt-1': 'text-4xl md:text-5xl font-light tracking-tight text-[#164E63] mt-2 mb-4',
    r'font-display text-3xl font-extrabold': 'text-4xl font-light tracking-tight',
    r'font-display text-lg font-bold text-[#164E63]': 'text-2xl font-light text-[#164E63]',
    r'font-display text-base font-bold text-[#164E63]': 'text-xl font-light text-[#164E63]',
    r'text-xs font-bold uppercase tracking-wider text-[#0891B2]': 'text-xs font-bold uppercase tracking-widest text-[#0891B2]/70',
    r'text-xs sm:text-sm text-\[\#164E63\]/60': 'text-sm text-[#164E63]/70',
    r'bg-[#ECFEFF] p-4': 'bg-white p-4',
    r'bg-[#ECFEFF] p-3': 'bg-white p-3',
    r'shadow-2xs': 'shadow-none',
}

def strip_dark_mode(text):
    return re.sub(r'\bdark:[a-zA-Z0-9_/-]+\b', '', text)

for root, _, files in os.walk('client/src'):
    for file in files:
        if file.endswith('.tsx') and file != 'ExecutiveDashboard.tsx':
            filepath = os.path.join(root, file)
            with open(filepath, 'r') as f:
                content = f.read()

            new_content = content
            for pattern, replacement in replacements.items():
                new_content = re.sub(pattern, replacement, new_content)
                
            new_content = strip_dark_mode(new_content)
            new_content = re.sub(r' +', ' ', new_content)

            if new_content != content:
                with open(filepath, 'w') as f:
                    f.write(new_content)
                print(f"Refactored {filepath}")

