const FormInput = ({ label, name, type, value, onChange, size, hint }) => {
  return (
    <div className='form-control'>
      <label htmlFor={name} className='label'>
        <span className='label-text capitalize'>{label}</span>
      </label>
      <input
        type={type}
        name={name}
        value={value} // Bind the value to the state
        className={`input input-bordered ${size}`}
        onChange={onChange} // Pass the onChange handler
      />
      {hint && <small className="form-hint">{hint}</small>}
    </div>
  );
};
export default FormInput;
