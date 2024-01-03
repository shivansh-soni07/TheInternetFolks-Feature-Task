import React from "react";
import { useTheme } from "@chakra-ui/react";
import FromWrapper from "./FormWrapper";
import { IFormInputProps } from "@src/interface/forms";
import ReactSelect, { Props } from "react-select";
import { useData } from "@src/containers/home/DataProvider";
import { initialValues } from "@src/containers/home/DataProvider";
interface IFormSelectProps
  extends Omit<IFormInputProps, "inputProps" | "type" | "onChange" | "onBlur"> {
  options: { label: string; value: string }[] | any;
  selectProps?: Props;
  onChange?: any;
  onBlur?: any;
}

const FormSelect: React.FC<IFormSelectProps> = ({
  name,
  label,
  placeholder,
  value,
  onChange,
  onBlur,
  error,
  touched,
  selectProps = {},
  children,
  helperText,
  wrapperProps = {},
  options,
}) => {
  const theme = useTheme();

  const { state, setState } = useData() as {
    state: typeof initialValues;
    setState: React.Dispatch<typeof initialValues>;
  };

  function findNestedObject(fieldName: string, obj: any): string | null {
    for (let key in obj) {
      if (obj.hasOwnProperty(key) && typeof obj[key] === "object") {
        if (obj[key].hasOwnProperty(fieldName)) {
          return key;
        } else {
          const result = findNestedObject(fieldName, obj[key]);
          if (result) {
            return key + "." + result;
          }
        }
      }
    }
    return null;
  }

  // const handleChange = (value: any) => {
  //   onChange && onChange(name, value?.value);
  // };

  const handleChange = (e: { value: any }) => {
    const inputValue = e.value;

    const nestedObjectName = findNestedObject(name, state);

    if (nestedObjectName) {
      const statusCopy = Object.assign({}, state);
      (statusCopy as any)[nestedObjectName][name] = inputValue;

      setState(statusCopy);
    }
    onChange && onChange(name, e?.value);
  };

  const handleBlur = () => {
    onBlur && onBlur(name, true);
  };

  return (
    <FromWrapper
      isInvalid={Boolean(error && touched)}
      wrapperProps={wrapperProps}
      helperText={helperText}
      label={label}
      error={error as string}
      touched={touched}
    >
      <ReactSelect
        name={name}
        placeholder={placeholder}
        value={options.find((item: { value: string }) => item?.value === value)}
        onChange={handleChange}
        onBlur={handleBlur}
        options={options}
        // styles
        styles={{
          container: (base) => ({
            ...base,
            width: "100%",
            minWidth: "none",
            height: "auto",
            maxHeight: "none",
            minHeight: "none",
          }),
          control: (base, { isFocused }) => ({
            ...base,
            width: "100%",
            minWidth: "272px",
            height: "45px",
            border: isFocused
              ? `1px solid ${theme.colors.primary}`
              : error
              ? `1px solid ${theme.colors.errorRed}`
              : "1px solid #c0bcd7",
            backgroundColor: theme.colors.inputBg,
            borderRadius: "10px",
            fontSize: ".875rem",
            fontWeight: "500",
            "&:hover": {
              border: `1px solid ${theme.colors.primary}`,
            },
          }),
          valueContainer: (base) => ({
            ...base,
            paddingLeft: "20px",
          }),
          option: (base, { isFocused }) => ({
            ...base,
            fontSize: ".875rem",
            fontWeight: "500",
          }),
        }}
        {...selectProps}
      />
      {children}
    </FromWrapper>
  );
};

export default FormSelect;
