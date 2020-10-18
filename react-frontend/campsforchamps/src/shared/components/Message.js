import React from "react";

export const showWarningMsg = (display, message) => {
  if (display) {
    return (
      <div className="warning-msg">
        <i className="fas fa-exclamation-circle"></i> {message}
      </div>
    );
  }
};
