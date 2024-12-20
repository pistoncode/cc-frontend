import PropTypes from 'prop-types';

import Box from '@mui/material/Box';

import { useAuthContext } from 'src/auth/hooks';

import CampaignItem from './campaign-item';

// ----------------------------------------------------------------------

export default function CampaignLists({ campaigns, mutate }) {
  const { user } = useAuthContext();

  return (
    <>
      <Box
        gap={2}
        display="grid"
        gridTemplateColumns={{
          xs: 'repeat(1, 1fr)',
          sm: 'repeat(2, 1fr)',
          md: 'repeat(3, 1fr)',
        }}
      >
        {campaigns.map((campaign) => (
          <CampaignItem key={campaign.id} campaign={campaign} user={user} mutate={mutate} />
        ))}
      </Box>

      {/* {totalCampaigns > maxItemsPerPage && (
        <Pagination
          count={Math.ceil(totalCampaigns / maxItemsPerPage)}
          page={page}
          onChange={onPageChange}
          sx={{
            mt: 8,
            [`& .${paginationClasses.ul}`]: {
              justifyContent: 'center',
            },
          }}
        />
      )} */}
    </>
  );
}

CampaignLists.propTypes = {
  campaigns: PropTypes.array.isRequired,
  mutate: PropTypes.func,
  // totalCampaigns: PropTypes.number.isRequired,
  // page: PropTypes.number.isRequired,
  // onPageChange: PropTypes.func.isRequired,
  // maxItemsPerPage: PropTypes.number.isRequired,
};
