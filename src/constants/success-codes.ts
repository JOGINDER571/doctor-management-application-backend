export type SuccessDetail = {
  status_code: number;
  message: string;
};

type SuccessCategories = {
  AUTHENTICATION: {
    LOGIN_SUCCESS: SuccessDetail;
    LOGOUT_SUCCESS: SuccessDetail;
    FORGOT_PASSWORD: SuccessDetail;
    VALIDATE_TOKEN: SuccessDetail;
    CHANGE_PASSWORD: SuccessDetail;
  };
  AUTHORIZATION: {
    MFA_SENT: SuccessDetail;
    MFA_VERIFIED: SuccessDetail;
  };
  RESOURCE: {
    RESOURCE_CREATED: SuccessDetail;
    RESOURCE_UPDATED: SuccessDetail;
    RESOURCE_RETRIEVED: SuccessDetail;
    RESOURCE_DELETED: SuccessDetail;
  };
  GENERAL: {
    OPERATION_COMPLETED: SuccessDetail;
  };
  USER: {
    USER_CREATED: SuccessDetail;
    USER_RETRIEVED: SuccessDetail;
  };
};

export const SUCCESS_CODES: SuccessCategories = {
  AUTHENTICATION: {
    LOGIN_SUCCESS: {
      status_code: 200,
      message: "User logged in successfully.",
    },
    LOGOUT_SUCCESS: {
      status_code: 200,
      message: "User logged out successfully.",
    },
    FORGOT_PASSWORD: {
      status_code: 200,
      message:
        "If an account is associated with the provided email, you will receive a password reset link shortly. Please check your inbox and spam folder.",
    },
    VALIDATE_TOKEN: {
      status_code: 200,
      message: "Token successfully validated.",
    },
    CHANGE_PASSWORD: {
      status_code: 200,
      message: "Password has been successfully changed.",
    },
  },
  AUTHORIZATION: {
    MFA_SENT: {
      status_code: 200,
      message: "OTP sent.",
    },
    MFA_VERIFIED: {
      status_code: 200,
      message: "OTP verified successfully",
    },
  },
  RESOURCE: {
    RESOURCE_CREATED: {
      status_code: 201,
      message: "Resource created successfully.",
    },
    RESOURCE_UPDATED: {
      status_code: 200,
      message: "Resource updated successfully.",
    },
    RESOURCE_RETRIEVED: {
      status_code: 200,
      message: "Resource retrieved successfully.",
    },
    RESOURCE_DELETED: {
      status_code: 200,
      message: "Resource removed successfully",
    },
  },
  GENERAL: {
    OPERATION_COMPLETED: {
      status_code: 200,
      message: "Operation completed successfully.",
    },
  },
  USER: {
    USER_CREATED: {
      status_code: 201,
      message: "User created successfully",
    },
    USER_RETRIEVED: {
      status_code: 200,
      message: "User retrieved successfully",
    },
  },
};
