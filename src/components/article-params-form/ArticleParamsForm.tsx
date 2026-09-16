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
	OptionType,
} from 'src/constants/articleProps';
import { Select } from 'src/ui/select';
import { Text } from 'src/ui/text';
import { RadioGroup } from 'src/ui/radio-group';
import { Separator } from 'src/ui/separator';

interface ArticleParamsFormProps {
	currentAppState: ArticleStateType;
	onApply: (state: ArticleStateType) => void;
	onReset: () => void;
}

export const ArticleParamsForm = ({
	currentAppState,
	onApply,
	onReset,
}: ArticleParamsFormProps) => {
	const [isOpen, setIsOpen] = useState(false);
	const formRef = useRef<HTMLDivElement>(null);

	const [formState, setFormState] = useState<ArticleStateType>(currentAppState);

	const updateFormField = (field: keyof ArticleStateType) => {
		return (value: OptionType) => {
			setFormState((prev) => ({
				...prev,
				[field]: value,
			}));
		};
	};

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
		setFormState(defaultArticleState);

		onReset();
		setIsOpen(false);
	};

	const handleSubmit = (event: React.FormEvent) => {
		event.preventDefault();
		onApply(formState);
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
							selected={formState.fontFamilyOption}
							options={fontFamilyOptions}
							onChange={updateFormField('fontFamilyOption')}
							title='шрифт'
						/>
						<RadioGroup
							selected={formState.fontSizeOption}
							options={fontSizeOptions}
							onChange={updateFormField('fontSizeOption')}
							title='размер шрифта'
							name={'Font Size'}
						/>
						<Select
							selected={formState.fontColor}
							options={fontColors}
							onChange={updateFormField('fontColor')}
							title='цвет шрифта'
						/>
					</div>
					<Separator></Separator>
					<div className={styles.backgroundParams}>
						<Select
							selected={formState.backgroundColor}
							options={backgroundColors}
							onChange={updateFormField('backgroundColor')}
							title='цвет фона'
						/>
						<Select
							selected={formState.contentWidth}
							options={contentWidthArr}
							onChange={updateFormField('contentWidth')}
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
