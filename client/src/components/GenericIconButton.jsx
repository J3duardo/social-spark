import React from "react";
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";

const Button = (props) => {
  const {children, onClick, btnClassName, tipTitle, tipClassName, disabled} = props;

  return (
    <Tooltip title={tipTitle} className={tipClassName}>
      <IconButton disabled={disabled} onClick={onClick} className={btnClassName}>
        {children}
      </IconButton>
    </Tooltip>
  );
}

export default Button;
