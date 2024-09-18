import { useParams } from 'react-router';
import { Helmet } from 'react-helmet-async';


import MediaKitCreator from 'src/sections/creator/media-kit-creator-view/mediakit-view-by-id-public';
import { cleanDigitSectionValue } from '@mui/x-date-pickers/internals/hooks/useField/useField.utils';

// ----------------------------------------------------------------------

export default function Page() {
  const params = useParams();
  const { id } = params;

  return (
    <>
      <Helmet>
        <title>Media Kit</title>
      </Helmet>

      <MediaKitCreator creatorId={id}/>
    </>
  );
}