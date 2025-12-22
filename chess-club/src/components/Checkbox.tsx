function Checkbox({ label, checked, onChange, name }: { label: string; checked: boolean; onChange: (checked: boolean) => void; name?: string }) {

    return (
        <label className="flex items-center gap-3 cursor-pointer select-none">
            <input
                type="checkbox"
                name={name}
                checked={checked}
                onChange={(e) => onChange(e.target.checked)}
                className="
                    h-4 w-4
                    accent-club-secondary
                    rounded
                    cursor-pointer
                    "
            />
            <span className="text-sm font-medium text-club-dark">
                {label}
            </span>
        </label>
    );
}

export default Checkbox;