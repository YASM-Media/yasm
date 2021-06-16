import { Image, Link } from '@chakra-ui/react';

export interface BrandingProps {}

const Branding: React.FunctionComponent<BrandingProps> = () => {
  return (
    <Link href='/'>
      <Image
        h={{ base: 5, sm: 7, md: 8, lg: 10 }}
        cursor='pointer'
        src='https://firebasestorage.googleapis.com/v0/b/yasm-react.appspot.com/o/assets%2Fpng%2Flogo.png?alt=media'
      />
    </Link>
  );
};

export default Branding;
