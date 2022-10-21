import type { NextPage } from 'next'

import { handleSubmit } from '../helpers/formSubmit'
import { validateName, validatePassword } from '../helpers/validators'
import Field, { FormContext } from '../components/Field'
import Layout from '../components/Layout'
import styles from '../styles/Home.module.css'

const Form: NextPage = () => {

	const formValidators = {
		formName: validateName,
		formPassword: validatePassword,
	}

	return (
		<Layout>
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
						autocomplete='new-password'
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

export default Form