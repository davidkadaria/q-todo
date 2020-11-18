import styles from './link.module.css';

function Link(props) {
	return (
		<li
			title={`navigate to my ${props.NetworkName} page`}
			className={`q-p-r q-t q-bg-dark q-h-bg-primary q-bc-primary q-h-f-light q-o-hidden ${styles.container}`}
		>
			<a
				className='q-p-a q-w-all q-h-all q-d-f--cc'
				target='_blank'
				rel='noreferrer noopener'
				href={props.Link}
			>
				{props.children}
			</a>
		</li>
	);
}

export default Link;