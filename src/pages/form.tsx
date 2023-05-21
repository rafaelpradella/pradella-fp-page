import type { NextPage } from 'next'
import Script from 'next/script';

import { handleSubmit } from '~/helpers/formSubmit'
import { validateName, validatePassword } from '~/helpers/validators'
import { Field, FormContext } from '~/components/Field'
import { Layout } from '~/components/Layout'
import styles from '~/styles/Home.module.scss'
import React from 'react';

const Form: NextPage = () => {

	const formValidators = {
		formName: validateName,
		formPassword: validatePassword,
	}

	const GTMFallback = () => (
		<noscript>
			<iframe src="https://www.googletagmanager.com/ns.html?id=GTM-MMTJL27"
				height="0" width="0" style={{ display: 'none', visibility: 'hidden' }}/>
			</noscript>
	);

	return (
		<Layout>
			<Script
				id='gtm'
				dangerouslySetInnerHTML={{ __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
				new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
				j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
				'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
				})(window,document,'script','dataLayer','GTM-MMTJL27');` }}
			/>
			<GTMFallback />
			<h1 className={styles.title}>
				Functional Form
			</h1>

			<FormContext.Provider value={formValidators}>
				<form
					action='/api/fpts-form'
					method='POST'
					className={styles.mainForm}
					onSubmit={(e) => handleSubmit(e, formValidators)}
				>
					<Field
						isRequired
						type='text'
						fieldId='formName'
						placeholder='E.g. John Doe'
						label='Your Name'
					/>
					<Field
						isRequired
						type='password'
						fieldId='formPassword'
						label='Password'
						placeholder='Insert a new password'
						autoComplete='new-password'
					/>
					<Field
						type='checkbox'
						fieldId='formCheckTest'
						label='I accept being part of the FPTS Members™ signature'
					/>
					<button
						className={styles.sendButton}
						type='submit'
					>
						Apply changes
					</button>
				</form>
			</FormContext.Provider>
		</Layout>
	)
}

export default Form;