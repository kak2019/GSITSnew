import * as React from 'react';
import {useContext} from 'react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { PrimaryButton, TextField, Separator } from '@fluentui/react';
// import { getAADClient } from '../../../../pnpjsConfig';
// import { AadHttpClient } from '@microsoft/sp-http';
// import { CONST } from '../../../../config/const';
import { useUser } from '../../../../hooks';
import theme from '../../../../config/theme';
import AppContext from '../../../../AppContext';


const DemoForm: React.FC = () => {

    const validationSchema = Yup.object({
        name: Yup.string().required('Name is required')
            .min(2, 'Name must be at least 2 characters'),
        email: Yup.string().email('Invalid email address').required('Email is required'),
    });
    const ctx=useContext(AppContext);
    

    React.useEffect((): void => {
        // Dome function app
        const fetchData = async (): Promise<void> => {
            try {
                // const client = getAADClient();
                // const response = await client.get(`${CONST.azureFunctionBaseUrl}/api/GetParma?q=981`, AadHttpClient.configurations.v1);
                // const result = await response.json();
                // console.log(result);
                const u=useUser();
                //const r=await u.getUserType('gmanuel@magnistrucks.com');
                //const r=await u.getUserSupplierId('gmanuel@magnistrucks.com');
                const email=u.getUserEmail(ctx);
                console.log(email);
                const r=await u.getUserType(email);
                console.log(r);
                const g=await u.getGPSUser(email);
                console.log(g);
            }
            catch (error) {
                console.error(error);

            }
        };
        fetchData().then(_ => _, _ => _);

    }, []);
    return (
        <Formik
            initialValues={{ name: '', email: '' }}
            validationSchema={validationSchema}
            onSubmit={(values, { setSubmitting }) => {
                setTimeout(() => {
                    alert(JSON.stringify(values, null, 2));
                    setSubmitting(false);
                }, 400);
            }}
        >
            {({ isSubmitting, handleChange, handleBlur, values, errors, touched }) => (
                <Form style={{backgroundColor:theme.colors.backgroundForm}}>
                    <div>
                        <TextField
                            label="Name"
                            name="name"
                            value={values.name}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            errorMessage={touched.name && errors.name ? errors.name : undefined}
                        />
                    </div>
                    <div>
                        <TextField
                            label="Email"
                            name="email"
                            type="email"
                            value={values.email}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            errorMessage={touched.email && errors.email ? errors.email : undefined}
                        />
                    </div>
                    <Separator />
                    <PrimaryButton type='submit' disabled={isSubmitting}>
                        {isSubmitting ? 'Submitting...' : 'Submit'}
                    </PrimaryButton>

                </Form>
            )}

        </Formik>
    );
};

export default DemoForm;