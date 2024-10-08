import React from 'react';
import { isArray } from 'lodash';
import { m } from 'framer-motion';

import { Container, Typography } from '@mui/material';

import ForbiddenIllustration from 'src/assets/illustrations/forbidden-illustration';

import { varBounce, MotionContainer } from 'src/components/animate';

import { useAuthContext } from '../hooks';

const withPermission = (requiredPermission, WrappedComponent) => (props) => {
  const { user, permission } = useAuthContext();

  const missingPermissions = requiredPermission.filter(
    (elem) => !permission?.map((item) => item.name).includes(elem)
  );

  if (user?.role === 'superadmin') {
    return <WrappedComponent {...props} />;
  }

  if (
    isArray(requiredPermission) &&
    requiredPermission.every((elem) => permission?.map((item) => item.name).includes(elem))
  ) {
    return <WrappedComponent {...props} />;
  }

  return (
    <Container component={MotionContainer} sx={{ textAlign: 'center' }}>
      <m.div variants={varBounce().in}>
        <Typography variant="h3" sx={{ mb: 2 }}>
          Permission Denied
        </Typography>
      </m.div>

      <m.div variants={varBounce().in}>
        <Typography sx={{ color: 'text.secondary' }}>
          You do not have permission to access this page
          {JSON.stringify(missingPermissions)}
        </Typography>
      </m.div>

      <m.div variants={varBounce().in}>
        <ForbiddenIllustration
          sx={{
            height: 260,
            my: { xs: 5, sm: 10 },
          }}
        />
      </m.div>
    </Container>
  );
};

export default withPermission;
