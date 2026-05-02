import './NamePicker.css'

export default function NamePicker({ value, onChange }) {
  return (
    <div className="name-picker">
      <input
        id="author-name"
        className="name-picker__input"
        type="text"
        placeholder="e.g. Anya, Marco, Suki…"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        maxLength={32}
      />
    </div>
  )
}
