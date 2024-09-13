/* eslint-disable react/prop-types */
import React from 'react';

import { deepOrange } from '@mui/material/colors';
import { Box, Stack, Avatar, useTheme, Typography } from '@mui/material';

import Label from 'src/components/label';
import Iconify from 'src/components/iconify';

const MediaKitCover = ({ user }) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        p: 5,
      }}
    >
      <Stack direction="column" alignItems="center" gap={2}>
        <Avatar sx={{ bgcolor: deepOrange[500], width: 150, height: 150 }}>N</Avatar>
        <Typography variant="h2" color={theme.palette.text.primary} fontWeight={800}>
          {user?.creator?.mediaKit?.name || user?.name}
        </Typography>
        <Stack
          direction="row"
          gap={2}
          flexWrap="wrap"
          sx={{
            justifyContent: 'center',
          }}
        >
          {(user &&
            user?.creator?.mediaKit?.interests.map((elem, index) => <Label>{elem}</Label>)) ||
            (user && user?.creator?.interests?.map((elem, index) => <Label>{elem?.name}</Label>))}
        </Stack>
        <Stack gap={2}>
          <Typography
            gutterBottom
            variant="body1"
            maxWidth={500}
            textAlign="center"
            lineHeight={1.2}
            fontWeight={600}
            color={theme.palette.grey[600]}
            sx={{
              wordWrap: 'break-word',
              overflowWrap: 'break-word',
            }}
          >
            {user?.creator?.mediaKit?.about}
          </Typography>
          <Stack
            direction={{ sm: 'row' }}
            justifyContent="space-evenly"
            alignItems="center"
            spacing={2}
          >
            <Stack direction="row" spacing={1} alignItems="center">
              <Iconify icon="mingcute:location-fill" />
              <Typography variant="subtitle2" fontWeight={800}>
                Live at {user?.country}
              </Typography>
            </Stack>
            <Stack direction="row" spacing={1} alignItems="center">
              <Iconify icon="mdi:email" />
              <Typography variant="subtitle2" fontWeight={800}>
                {user?.email}
              </Typography>
            </Stack>
          </Stack>
        </Stack>
      </Stack>
    </Box>
  );
};
export default MediaKitCover;
