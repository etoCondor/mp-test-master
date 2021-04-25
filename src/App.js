import React, { useContext, useEffect, useState } from "react";

import { observer } from "mobx-react-lite";
import { storeContext } from "./store";

export default function App() {
	return (
		<div className='App'>
			<TestLocationsList />
		</div>
	);
}

const TestLocationForm = observer(function TestLocationForm({
	location,
	locationsList,
	setLocationsList,
}) {
	const store = useContext(storeContext);
	const locations = store.locations.map((item) => (
		<option key={item.locationID} value={item.locationID}>
			{item.name}
		</option>
	));
	const servers = store.servers.map((item) => {
		if (
			item.locationID === location.locationID &&
			item.envID === location.envID
		) {
			return <p key={item.serverID}>{item.name}</p>;
		}
		return null;
	});

	const getAvailableEnvs = (locationID) => {
		const envData = store.servers.reduce((acc, item) => {
			if (item.locationID === locationID && !acc.includes(item.envID)) {
				acc.push(item.envID);
			}
			return acc;
		}, []);
		return envData;
	};

	const arrOfEnvs = getAvailableEnvs(location.locationID);

	const handleChange = (value, fieldName) => {
		const newLocation = { ...location, [fieldName]: value };
		if (fieldName === "locationID")
			newLocation.envID = getAvailableEnvs(value)[0] || null;
		const newLocationsList = [...locationsList];
		const currentIndex = newLocationsList.indexOf(location);
		newLocationsList.splice(currentIndex, 1, newLocation);
		setLocationsList(newLocationsList);
	};
	const handleDelete = () => {
		const newLocationsList = [...locationsList];
		newLocationsList.splice(newLocationsList.indexOf(location), 1);
		setLocationsList(newLocationsList);
	};

	return (
		(store.isLoaded && (
			<div className='location'>
				<header>
					<h1>Тестовая локация {locationsList.indexOf(location) + 1}</h1>
					<div className='trash' onClick={() => handleDelete()}></div>
				</header>
				<div className='topDiv'>
					<div className='leftDiv'>
						<p>Локация</p>
					</div>
					<div className='rightDiv'>
						<div className='locationID'>
							<select
								className='locationSelect'
								value={location.locationID || ""}
								onChange={(evt) =>
									handleChange(+evt.target.value, "locationID")
								}
							>
								{locations}
							</select>
						</div>
						<div className='envID'>
							<p>Среда</p>
							<select
								className='envSelect'
								value={location.envID || ""}
								onChange={(evt) => handleChange(+evt.target.value, "envID")}
							>
								{store.envs.map((env) => {
									return arrOfEnvs.includes(env.envID) ? (
										<option key={env.envID} value={env.envID}>
											{env.name}
										</option>
									) : null;
								})}
							</select>
						</div>
						<div className='servers'>
							<p>Серверы</p>
							<div className='serversInfo'>{servers}</div>
						</div>
					</div>
				</div>
				<div className='bottomDiv'>
					<div className='leftDiv'>
						<p>Подсказка</p>
					</div>
					<div className='rightDiv'>
						<input
							placeholder='Комментарий по локации'
							value={location.hint}
							onChange={(evt) => handleChange(evt.target.value, "hint")}
						></input>
					</div>
				</div>
			</div>
		)) || <div>Fetching data, please wait!</div>
	);
});

const TestLocationsList = () => {
	const [locationsList, setLocationsList] = useState([
		{ locationID: 1, envID: 1, hint: "" },
	]);
	const store = useContext(storeContext);
	useEffect(() => {
		if (!store.isLoaded) {
			store.fetchData();
		}
	}, [store]);

	return (
		<>
			{locationsList.map((location, index) => (
				<TestLocationForm
					key={`location-${index}`}
					location={location}
					locationsList={locationsList}
					setLocationsList={setLocationsList}
				/>
			))}
			<div className='buttons'>
				<button
					className='addBtn'
					onClick={() => {
						setLocationsList([
							...locationsList,
							{ locationID: 1, envID: 1, hint: "" },
						]);
					}}
				>
					Добавить тестовую локацию
				</button>
				<button
					className='logBtn'
					onClick={() => {
						console.log(locationsList);
					}}
				>
					Вывести результат в консоль
				</button>
			</div>
		</>
	);
};
