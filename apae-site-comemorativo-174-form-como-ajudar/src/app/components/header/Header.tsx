"use client";

import { usePathname } from "next/navigation";
import Image from "next/image";
import styles from "./Header.module.css";
import {
    AlignJustify,
    Accessibility,
    Contrast,
    EyeOff,
    Text,
} from "lucide-react";
import { useState, useEffect } from "react";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import Link from "next/link";
import Popover from "@mui/material/Popover";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Switch from "@mui/material/Switch";
import { useAcessibilidade } from "../../hooks/useAcessibilidade";

export default function Header() {
    const pathname = usePathname();
    
    const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    const {
        configuracoes,
        alternarContraste,
        alternarEscalaCinza,
        diminuirFonte,
        aumentarFonte,
        resetConfiguracoes,
    } = useAcessibilidade();
    
    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
    const handleLinkClick = () => setIsMenuOpen(false);
    const handleAccessibilityClick = (event: React.MouseEvent<HTMLElement>) =>
        setAnchorEl(event.currentTarget);
    const handleClose = () => setAnchorEl(null);

    const open = Boolean(anchorEl);
    const id = open ? "accessibility-popover" : undefined;
    
    const handleLogoClick = () => {
        resetConfiguracoes();
        window.location.href = "/apae-site-comemorativo/";
    };

    useEffect(() => {
        const body = document.body;
        
        const darkMode = configuracoes.contraste === "altoContraste";
        const [mainColor, secondaryColor] = darkMode ? ["white", "black"] : ["black", "white"];

        document.querySelectorAll("img").forEach(image => (image as HTMLElement).style.filter = `invert(${darkMode ? 1 : 0})`);
        
        const elementsToEditColor: string[] = ["body", ".timelineDot"];
        for(const element of elementsToEditColor) {
            const rawElements = document.querySelectorAll(element);
            for(const el of rawElements){
                if(el){
                    (el as HTMLElement).style.color = mainColor;
                    (el as HTMLElement).style.background = secondaryColor;
                }
            }
        }
        
        body.style.filter = `grayscale(${configuracoes.escalaCinza === "escalaCinzaAtiva" ? 1 : 0})`;
        
        body.style.fontSize = `${configuracoes.fonte}px`;
        const buttons = document.body.getElementsByTagName("button");
        for(const button of buttons){
            (button as HTMLElement).style.fontSize = `${configuracoes.fonte}px`;
        }
        const h1s = document.body.getElementsByTagName("h1");
        for(const h1 of h1s){
            (h1 as HTMLElement).style.fontSize = `${configuracoes.fonte + 24}px`;
        }
        const h2s = document.body.getElementsByTagName("h2");
        for(const h2 of h2s){
            (h2 as HTMLElement).style.fontSize = `${configuracoes.fonte + 20}px`;
        }
        
    }, [configuracoes, pathname]);

    return (
        <>
            <div className={styles.header} style={{ backgroundColor: configuracoes.contraste === "altoContraste" ? "black" : "white" }}>
                <div onClick={handleLogoClick} style={{ cursor: "pointer" }}>
                    <Image
                        src="/apae-site-comemorativo/logo-apae.png"
                        alt="Logotipo da APAE com duas mãos cinzas envolvendo uma flor amarela de pétalas abertas sobre um ramo verde"
                        width={120}
                        height={50}
                    />
                </div>
                <span className={styles.rightSideSpan}>
                    <button
                        className={styles.accessibilityButton}
                        onClick={handleAccessibilityClick}
                        aria-describedby={id}
                        aria-label="Acessibilidade"
                        type="button"
                    >
                        <Accessibility size={20} />
                    </button>
                    <div className={styles.linksTelas}>
                        <Link
                            href="/"
                            className={pathname === "/" ? styles.linkAtivo : styles.link}
                        >
                            Página Inicial
                        </Link>
                        <Link
                            href="/pages/30anos"
                            className={
                                pathname === "/pages/30anos" ? styles.linkAtivo : styles.link
                            }
                        >
                            30 Anos
                        </Link>
                        <Link
                            href="/pages/contato"
                            className={
                                pathname === "/pages/contato" ? styles.linkAtivo : styles.link
                            }
                        >
                            Contato
                        </Link>
						<Link
        					href="/pages/como-ajudar"
        					className={
            					pathname === "/pages/como-ajudar" ? styles.linkAtivo : styles.link
        					}				
    					>
        					Como Ajudar
    					</Link>
                    </div>
                    <button
                        className={styles.hamburguer}
                        onClick={toggleMenu}
                        type="button"
                    >
                        <AlignJustify color="#0D4F97" />
                    </button>
                </span>
            </div>

            <Popover
                id={id}
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                container={typeof window !== "undefined" ? document.body : undefined}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                transformOrigin={{ vertical: "top", horizontal: "right" }}
                PaperProps={{
                    sx: { position: "fixed", zIndex: 1400, mt: 1 },
                }}
                disableScrollLock
                disableRestoreFocus
            >
                <div 
                    className={styles.accessibilityBox} 
                    onMouseLeave={handleClose}
                >
                    <Typography variant="subtitle1" fontWeight={600} mb={1}>
                        Acessibilidade
                    </Typography>

                    <div className={styles.accessibilityOption}>
                        <div className={styles.accessibilityIconText}>
                            <Contrast size={18} />
                            <span>Modo Alto Contraste</span>
                        </div>
                        <Switch
                            checked={configuracoes.contraste === "altoContraste"}
                            onChange={alternarContraste}
                        />
                    </div>

                    <div className={styles.accessibilityOption}>
                        <div className={styles.accessibilityIconText}>
                            <EyeOff size={18} />
                            <span>Escala de Cinza</span>
                        </div>
                        <Switch
                            checked={configuracoes.escalaCinza === "escalaCinzaAtiva"}
                            onChange={alternarEscalaCinza}
                        />
                    </div>

                    <div className={styles.accessibilityOption}>
                        <div className={styles.accessibilityIconText}>
                            <Text size={18} />
                            <span>Tamanho da Fonte</span>
                        </div>
                        <div>
                            <Button size="small" onClick={diminuirFonte}>
                                A-
                            </Button>
                            <Button size="small" onClick={aumentarFonte}>
                                A+
                            </Button>
                        </div>
                    </div>
                </div>
            </Popover>

			{/* Menu lateral para mobile */}
			<SwipeableDrawer
				anchor="right"
				open={isMenuOpen}
				onClose={toggleMenu}
				onOpen={() => {}}
				disableSwipeToOpen
			>
				<ul className={styles.menu}>
					<li>
						<Link href="/" onClick={handleLinkClick}>
							Página Inicial
						</Link>
					</li>
					<li>
						<Link href="/pages/30anos" onClick={handleLinkClick}>
							30 Anos
						</Link>
					</li>
					<li>
						<Link href="/pages/contato" onClick={handleLinkClick}>
							Contato
						</Link>
					</li>
					<li>
        				<Link href="/pages/como-ajudar" onClick={handleLinkClick}>
            				Como Ajudar
        				</Link>
    				</li>
				</ul>
			</SwipeableDrawer>
		</>
	);
}
