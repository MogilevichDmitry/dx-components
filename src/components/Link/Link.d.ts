export type TLinkProps = {
	children?: React.ReactNode,
	href?: string,
	target?: string,
	rel?: string,
	isDisabled?: boolean,
	processEmptyHash?: boolean,
	onClick?: Function,
	theme?: {
		container?: string,
		container_isDisabled?: string
	}
};

export declare const LINK: symbol;

declare const Link: React.ComponentClass<TLinkProps>;
export default Link;