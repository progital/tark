import { createTheme } from '@mui/material';

declare module '@mui/material/styles' {
  // type `Theme`
  interface Palette {
    neutral: Record<number, string>;
  }
  // allow configuration using `createTheme`
  interface PaletteOptions {
    neutral: Record<number, string>;
  }
}

declare module '@mui/material' {
  // type `Theme`
  interface Palette {
    neutral: Record<number, string>;
  }
  // allow configuration using `createTheme`
  interface PaletteOptions {
    neutral: Record<number, string>;
  }
}

const palette = {
  neutral: {
    100: '#F3F4F6',
    200: '#E5E7EB',
    300: '#D1D5DB',
    400: '#9CA3AF',
    500: '#6B7280',
    600: '#4B5563',
    700: '#374151',
    800: '#1F2937',
    900: '#111827',
  },
  action: {
    active: '#6B7280',
    focus: 'rgba(55, 65, 81, 0.12)',
    hover: 'rgba(55, 65, 81, 0.04)',
    selected: 'rgba(55, 65, 81, 0.08)',
    disabledBackground: 'rgba(55, 65, 81, 0.12)',
    disabled: 'rgba(55, 65, 81, 0.26)',
  },
  background: {
    default: '#F9FAFC',
    paper: '#FFFFFF',
  },
  divider: '#E6E8F0',
  primary: {
    light: '#c15f73',
    main: '#b23850',
    dark: '#551B26',
    contrastText: '#FFFFFF',
  },
  secondary: {
    light: '#9da6bb',
    main: '#8590aa',
    dark: '#5d6476',
    contrastText: '#FFFFFF',
  },
  success: {
    main: '#14B8A6',
    light: '#43C6B7',
    dark: '#0E8074',
    contrastText: '#FFFFFF',
  },
  info: {
    main: '#2196F3',
    light: '#64B6F7',
    dark: '#0B79D0',
    contrastText: '#FFFFFF',
  },
  warning: {
    main: '#FFB020',
    light: '#FFBF4C',
    dark: '#B27B16',
    contrastText: '#FFFFFF',
  },
  error: {
    main: '#D14343',
    light: '#DA6868',
    dark: '#922E2E',
    contrastText: '#FFFFFF',
  },
  text: {
    primary: '#060914',
    secondary: '#3A4350',
    disabled: 'rgba(55, 65, 81, 0.48)',
  },
};

export const theme = createTheme({
  breakpoints: {
    values: {
      xs: 0,
      sm: 540,
      md: 864,
      lg: 1200,
      xl: 1920,
    },
  },
  components: {
    MuiButton: {
      defaultProps: {
        disableElevation: true,
        variant: 'contained',
      },
      styleOverrides: {
        root: {
          textTransform: 'none',
        },
        sizeSmall: {
          padding: '6px 16px',
        },
        sizeMedium: {
          padding: '8px 20px',
        },
        sizeLarge: {
          padding: '11px 24px',
        },
        textSizeSmall: {
          padding: '7px 12px',
        },
        textSizeMedium: {
          padding: '9px 16px',
        },
        textSizeLarge: {
          padding: '12px 16px',
        },
      },
    },
    MuiButtonBase: {
      styleOverrides: {
        root: {
          '&, &.MuiButton-contained, &.MuiButton-outlined': {
            '&.Mui-focusVisible': {
              boxShadow: '0px 0px 7px 2px rgba(0,0,0,0.4)',
            },
          },
        },
      },
      defaultProps: {
        disableRipple: true,
      },
    },
    MuiCardContent: {
      styleOverrides: {
        root: {
          padding: '32px 24px',
          '&:last-child': {
            paddingBottom: '32px',
          },
        },
      },
    },
    MuiCardHeader: {
      defaultProps: {
        titleTypographyProps: {
          variant: 'h6',
        },
        subheaderTypographyProps: {
          variant: 'body2',
        },
      },
      styleOverrides: {
        root: {
          padding: '32px 24px',
        },
      },
    },
    MuiCssBaseline: {
      styleOverrides: {
        '*': {
          margin: 0,
          padding: 0,
        },
        html: {
          MozOsxFontSmoothing: 'grayscale',
          WebkitFontSmoothing: 'antialiased',
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100%',
          width: '100%',
        },
        body: {
          display: 'flex',
          flex: '1 1 auto',
          flexDirection: 'column',
          minHeight: '100%',
          width: '100%',
        },
        a: {
          '&, &:hover': {
            textDecoration: 'none',
            color: palette.primary.main,
          },
          '&:focus-visible, &:focus': {
            outline: 'none',
            textDecoration: 'underline',
          },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        notchedOutline: {
          borderColor: palette.divider,
        },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          backgroundColor: palette.neutral[100],
          '.MuiTableCell-root': {
            color: palette.neutral[700],
          },
          borderBottom: 'none',
          '& .MuiTableCell-root': {
            borderBottom: 'none',
            fontSize: '12px',
            fontWeight: 600,
            lineHeight: 1,
            letterSpacing: 0.5,
            textTransform: 'uppercase',
          },
          '& .MuiTableCell-paddingCheckbox': {
            paddingTop: 4,
            paddingBottom: 4,
          },
        },
      },
    },
  },
  palette,
  shape: {
    borderRadius: 8,
  },
  shadows: [
    'none',
    '0px 1px 1px rgba(100, 116, 139, 0.06), 0px 1px 2px rgba(100, 116, 139, 0.1)',
    '0px 1px 2px rgba(100, 116, 139, 0.12)',
    '0px 1px 4px rgba(100, 116, 139, 0.12)',
    '0px 1px 5px rgba(100, 116, 139, 0.12)',
    '0px 1px 6px rgba(100, 116, 139, 0.12)',
    '0px 2px 6px rgba(100, 116, 139, 0.12)',
    '0px 3px 6px rgba(100, 116, 139, 0.12)',
    '0px 2px 4px rgba(31, 41, 55, 0.06), 0px 4px 6px rgba(100, 116, 139, 0.12)',
    '0px 5px 12px rgba(100, 116, 139, 0.12)',
    '0px 5px 14px rgba(100, 116, 139, 0.12)',
    '0px 5px 15px rgba(100, 116, 139, 0.12)',
    '0px 6px 15px rgba(100, 116, 139, 0.12)',
    '0px 7px 15px rgba(100, 116, 139, 0.12)',
    '0px 8px 15px rgba(100, 116, 139, 0.12)',
    '0px 9px 15px rgba(100, 116, 139, 0.12)',
    '0px 10px 15px rgba(100, 116, 139, 0.12)',
    '0px 12px 22px -8px rgba(100, 116, 139, 0.25)',
    '0px 13px 22px -8px rgba(100, 116, 139, 0.25)',
    '0px 14px 24px -8px rgba(100, 116, 139, 0.25)',
    '0px 10px 10px rgba(31, 41, 55, 0.04), 0px 20px 25px rgba(31, 41, 55, 0.1)',
    '0px 25px 50px rgba(100, 116, 139, 0.25)',
    '0px 25px 50px rgba(100, 116, 139, 0.25)',
    '0px 25px 50px rgba(100, 116, 139, 0.25)',
    '0px 25px 50px rgba(100, 116, 139, 0.25)',
  ],
  typography: {
    button: {
      fontWeight: 600,
    },
    fontFamily:
      '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji"',
    body1: {
      fontSize: '1rem',
      fontWeight: 400,
      lineHeight: 1.5,
    },
    body2: {
      fontSize: '0.875rem',
      fontWeight: 400,
      lineHeight: 1.57,
    },
    subtitle1: {
      fontSize: '1rem',
      fontWeight: 500,
      lineHeight: 1.75,
    },
    subtitle2: {
      fontSize: '0.875rem',
      fontWeight: 500,
      lineHeight: 1.57,
    },
    overline: {
      fontSize: '0.75rem',
      fontWeight: 600,
      letterSpacing: '0.5px',
      lineHeight: 2.5,
      textTransform: 'uppercase',
    },
    caption: {
      fontSize: '0.75rem',
      fontWeight: 400,
      lineHeight: 1.66,
    },
    h1: {
      fontWeight: 700,
      fontSize: '2rem',
      lineHeight: 1.375,
    },
    h2: {
      fontWeight: 700,
      fontSize: '1.8rem',
      lineHeight: 1.375,
    },
    h3: {
      fontWeight: 400,
      fontSize: '1.8rem',
      lineHeight: 1.375,
    },
    h4: {
      fontWeight: 400,
      fontSize: '1.5rem',
      lineHeight: 1.375,
    },
    h5: {
      fontWeight: 600,
      fontSize: '1.3rem',
      lineHeight: 1.375,
    },
    h6: {
      fontWeight: 600,
      fontSize: '1.2rem',
      lineHeight: 1.375,
    },
  },
});
