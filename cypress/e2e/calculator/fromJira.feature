@CD-8
Feature: Test Execution Version 1

	@TEST_CD-7
	Scenario: Multiplizieren-zero-Success
		
		
	@TEST_CD-6
	Scenario Outline: Multiplizieren-notZero-Success
		When ich drücke Taste "<IntA>"
		 And ich drücke Taste "*"
		 And Zahl  <IntB>  auf Rechner drucken
		 And Das Ergebnis auf dem Display des Rechners prufen
		Then Das Ergebnis lautet  <Ergebnis>
		
		Examples:
			| Ergebnis	| IntA	| IntB	|
			| 12      	| 2   	| 6   	|
			| 36      	| 4   	| 9   	|
		
	@TEST_CD-5
	Scenario Outline: Dividieren-zero-Error
		When ich drücke Taste "<IntA>"
		 And ich drücke Taste "/"
		 And Zahl  <IntB>  auf Rechner drucken
		 And Der Rechner zeigt einen Fehler an
		Then Fehlermeldung
		
		Examples:
			| IntA	| IntB	|
			| 4   	| 0   	|
		
	@TEST_CD-4
	Scenario Outline: Dividieren-notZero-Success
		When ich drücke Taste "<IntA>"
		 And ich drücke Taste "/"
		 And Zahl  <IntB>  auf Rechner drucken
		 And Das Ergebnis auf dem Display des Rechners prufen
		Then Das Ergebnis lautet  <Ergebnis>
		
		Examples:
			| Ergebnis	| IntA	| IntB	|
			| 2       	| 8   	| 4   	|
		
	@TEST_CD-3
	Scenario Outline: Addieren-zero-Success
		When ich drücke Taste "<IntA>"
		 And ich drücke Taste "+"
		 And Zahl  <IntB>  auf Rechner drucken
		 And Das Ergebnis auf dem Display des Rechners prufen
		Then Das Ergebnis lautet  <Ergebnis>
		
		Examples:
			| Ergebnis	| IntA	| IntB	|
			| 5       	| 5   	| 0   	|
		
	@TEST_CD-2
	Scenario Outline: Addieren-notZero-Success
		When ich drücke Taste "<IntA>"
		 And ich drücke Taste "+"
		 And Zahl  <IntB>  auf Rechner drucken
		 And Das Ergebnis auf dem Display des Rechners prufen
		Then Das Ergebnis lautet  <Ergebnis>
		
		Examples:
			| Ergebnis	| IntA	| IntB	|
			| 12      	| 8   	| 4   	|
		
