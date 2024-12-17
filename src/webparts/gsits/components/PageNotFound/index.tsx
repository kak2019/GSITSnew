import * as React from 'react';
import { AppInsightsService } from '../../../../config/AppInsightsService';
import { Link } from 'react-router-dom';
const styles = {
    notFound: {
      textAlign: 'center' as const,
      marginTop: '50px',
    },
    heading: {
      fontSize: '6em',
      marginBottom: '20px',
    },
    paragraph: {
      fontSize: '1.5em',
      marginBottom: '20px',
    },
    link: {
      color: '#007bff',
      textDecoration: 'none',
      fontSize: '1.2em',
      ':hover': {
        textDecoration: 'underline',
      },
    },
  };
const PageNotFound: React.FC = () => {
    React.useEffect(()=>{
        AppInsightsService.aiInstance.trackEvent({ name: 'error running router', properties: { error:"Page Not Found" } });
    },[])
    return (
    <div style={styles.notFound}>
        <h1 style={styles.heading}>404</h1>
        <p style={styles.paragraph}>Oops! The page you are looking for does not exist.</p>
        <Link to="/" style={styles.link}>Go back to Home</Link>
    </div>
)
}

export default PageNotFound;