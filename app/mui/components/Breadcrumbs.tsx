import { NavigateNext as NextIcon } from '@mui/icons-material';
import { Breadcrumbs as MuiBreadcrumbs } from '@mui/material';

type BreadcrumbsProps = React.PropsWithChildren<{ className?: string }>;

export const Breadcrumbs = ({ children, ...props }: BreadcrumbsProps) => {
  return (
    <MuiBreadcrumbs
      separator={<NextIcon fontSize="small" />}
      aria-label="breadcrumb"
      sx={{
        '.MuiBreadcrumbs-li, .top-nav-crumb': {
          maxWidth: '15ch',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        },
        '&.top-nav': {
          ml: 2,
        },
      }}
      {...props}
    >
      {children}
    </MuiBreadcrumbs>
  );
};
