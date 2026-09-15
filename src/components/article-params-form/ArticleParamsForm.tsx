import { ArrowButton } from 'src/ui/arrow-button';
import { Button } from 'src/ui/button';
import { useEffect, useRef, useState } from 'react';

import styles from './ArticleParamsForm.module.scss';
import clsx from 'clsx';
import {
	ArticleStateType,
	backgroundColors,
	contentWidthArr,
	defaultArticleState,
	fontColors,
	fontFamilyOptions,
	fontSizeOptions,
} from 'src/constants/articleProps';
import { Select } from 'src/ui/select';
import { Text } from 'src/ui/text';
import { RadioGroup } from 'src/ui/radio-group';

interface ArticleParamsFormProps {
	onApply: (state: ArticleStateType) => void;
	onReset: () => void;
}

export const ArticleParamsForm = ({
	onApply,
	onReset,
}: ArticleParamsFormProps) => {
	const [isOpen, setIsOpen] = useState(false);
	const formRef = useRef<HTMLDivElement>(null);

	const [selectFontFamily, setFontFamily] = useState(
		defaultArticleState.fontFamilyOption
	);
	const [selectFontSize, setFontSize] = useState(
		defaultArticleState.fontSizeOption
	);
	const [selectFontColor, setFontColor] = useState(
		defaultArticleState.fontColor
	);

	const [selectBackgroundColor, setBackgroundColor] = useState(
		defaultArticleState.backgroundColor
	);
	const [selectContentWidth, setContentWidth] = useState(
		defaultArticleState.contentWidth
	);

	const togglePanel = () => {
		setIsOpen((prev) => !prev);
	};

	useEffect(() => {
		if (!isOpen) return;

		const handleOutsideClick = (event: MouseEvent) => {
			if (formRef.current && !formRef.current.contains(event.target as Node)) {
				setIsOpen(false);
			}
		};

		document.addEventListener('mousedown', handleOutsideClick);

		return () => {
			document.removeEventListener('mousedown', handleOutsideClick);
		};
	}, [isOpen]);

	const handleReset = (event: React.FormEvent) => {
		event.preventDefault();
		setFontFamily(defaultArticleState.fontFamilyOption);
		setFontSize(defaultArticleState.fontSizeOption);
		setFontColor(defaultArticleState.fontColor);
		setBackgroundColor(defaultArticleState.backgroundColor);
		setContentWidth(defaultArticleState.contentWidth);

		onReset();
	};

	const handleSubmit = (event: React.FormEvent) => {
		event.preventDefault();
		onApply({
			fontFamilyOption: selectFontFamily,
			fontSizeOption: selectFontSize,
			fontColor: selectFontColor,
			backgroundColor: selectBackgroundColor,
			contentWidth: selectContentWidth,
		});
		setIsOpen(false);
	};

	return (
		<div ref={formRef}>
			<ArrowButton isOpen={isOpen} onClick={togglePanel} />
			<aside
				className={clsx(styles.container, isOpen && styles.container_open)}>
				<form
					className={styles.form}
					onSubmit={handleSubmit}
					onReset={handleReset}>
					<Text as='h2' size={31} weight={800} uppercase>
						Задайте параметры
					</Text>
					<div className={styles.fontParams}>
						<Select
							selected={selectFontFamily}
							options={fontFamilyOptions}
							onChange={setFontFamily}
							title='шрифт'
						/>
						<RadioGroup
							selected={selectFontSize}
							options={fontSizeOptions}
							onChange={setFontSize}
							title='размер шрифта'
							name={'Font Size'}
						/>
						<Select
							selected={selectFontColor}
							options={fontColors}
							onChange={setFontColor}
							title='цвет шрифта'
						/>
					</div>
					<div className={styles.backgroundParams}>
						<Select
							selected={selectBackgroundColor}
							options={backgroundColors}
							onChange={setBackgroundColor}
							title='цвет фона'
						/>
						<Select
							selected={selectContentWidth}
							options={contentWidthArr}
							onChange={setContentWidth}
							title='ширина контента'
						/>
					</div>
					<div className={styles.bottomContainer}>
						<Button title='Сбросить' htmlType='reset' type='clear' />
						<Button title='Применить' htmlType='submit' type='apply' />
					</div>
				</form>
			</aside>
		</div>
	);
};
