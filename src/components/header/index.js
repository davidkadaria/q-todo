import styles from './header.module.css';

function Header() {
	return (
		<header className={`q-w-all q-ta-c ${styles.container}`}>
			<h1 className='q-c-dark q-tsc-primary'>Q - Todos</h1>
		</header>
	);
}

export default Header;