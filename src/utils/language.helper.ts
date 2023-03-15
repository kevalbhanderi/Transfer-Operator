import {
  ErrorMessagesEN,
  SuccessMessagesEN,
  ValidationMessagesEN,
} from '../config/english';
import {
  ErrorMessagesTH,
  SuccessMessagesTH,
  ValidationMessagesTH,
} from '../config/thai';

export const getErrorMessages = (language?: string) => {
  switch (language) {
    case 'TH': {
      return ErrorMessagesTH;
    }
    default: {
      return ErrorMessagesEN;
    }
  }
};

export const getSuccessMessages = (language?: string) => {
  switch (language) {
    case 'TH': {
      return SuccessMessagesTH;
    }
    default: {
      return SuccessMessagesEN;
    }
  }
};

export const getValidationMessages = (language?: string) => {
  switch (language) {
    case 'TH': {
      return ValidationMessagesTH;
    }
    default: {
      return ValidationMessagesEN;
    }
  }
};
