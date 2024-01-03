import React from "react";
import { Input } from "@chakra-ui/react";
import FormWrapper from "./FormWrapper";
import { IFormInputProps } from "@src/interface/forms";
import { useData } from "@src/containers/home/DataProvider";
import { initialValues } from "@src/containers/home/DataProvider";
const FormInput = React.forwardRef<HTMLInputElement, IFormInputProps>(
  (
    {
      name,
      label,
      placeholder,
      type,
      value,
      onChange,
      onBlur,
      error,
      touched,
      inputProps = {},
      children,
      helperText,
      wrapperProps = {},
    },
    ref
  ) => {
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

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const inputValue = e.target.value;

      const nestedObjectName = findNestedObject(name, state);

      if (nestedObjectName) {
        const statusCopy = Object.assign({}, state);
        (statusCopy as any)[nestedObjectName][name] = inputValue;

        setState(statusCopy);
      }
      onChange && onChange(e);
    };

    return (
      <FormWrapper
        isInvalid={Boolean(error && touched)}
        wrapperProps={wrapperProps}
        helperText={helperText}
        label={label}
        touched={touched}
        error={error as string}
      >
        <Input
          name={name}
          placeholder={placeholder}
          type={type}
          value={value}
          onChange={(e) => handleChange(e)}
          onBlur={onBlur}
          // styles
          width="100%"
          maxHeight="none !important"
          minW="272px"
          height="45px"
          fontSize="0.875rem"
          fontWeight="500"
          px="20px"
          border="1px solid #c0bcd7"
          bg="inputBg"
          borderRadius="10px"
          focusBorderColor="primary"
          errorBorderColor="errorRed"
          _placeholder={{
            color: "text.placeholder",
          }}
          ref={ref}
          {...inputProps}
        />
        {children}
      </FormWrapper>
    );
  }
);

FormInput.displayName = "FormInput";

export default FormInput;
