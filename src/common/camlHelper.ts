export const camlContainsText = (term: string, field: string): string =>
  `<Contains>
        <FieldRef Name="${field}"/>
        <Value Type="Text">${term}</Value>
    </Contains>`;
export const camlEqText = (term: string, field: string): string =>
  `<Eq>
        <FieldRef Name="${field}"/>
        <Value Type="Text">${term}</Value>
    </Eq>`;
export const camlGeqText = (term: string, field: string): string =>
  `<Geq>
        <FieldRef Name="${field}"/>
        <Value Type="Text">${term}</Value>
    </Geq>`;
export const camlLeqText = (term: string, field: string): string =>
  `<Leq>
        <FieldRef Name="${field}"/>
        <Value Type="Text">${term}</Value>
    </Leq>`;
export const camlEqNumber = (term: number, field: string): string =>
  `<Eq>
        <FieldRef Name="${field}"/>
        <Value Type="Number">${term}</Value>
    </Eq>`;
export const camlIsNullChoice = (field: string): string =>
  `<IsNull>
        <FieldRef Name="${field}"/>
    </IsNull>`;
export const camlEqChoice = (term: string, field: string): string =>
  `<Eq>
        <FieldRef Name="${field}"/>
        <Value Type="Choice">${term}</Value>
    </Eq>`;
export const camlCompareValueChoiceText = (
  term: string,
  field: string
): string => {
  return term.length > 0 ? camlEqChoice(term, field) : camlIsNullChoice(field);
};
export const camlGeqDate = (term: string, field: string): string => {
  const date = new Date(term);
  date.setDate(date.getDate() - 1);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `<Geq>
        <FieldRef Name="${field}"/>
        <Value Type="DateTime" IncludeTimeValue="TRUE" StorageTZ="TRUE">${year}-${month}-${day}T15:00:00Z</Value>
    </Geq>`;
};

export const camlLtDate = (term: string, field: string): string =>
  `<Lt>
        <FieldRef Name="${field}"/>
        <Value Type="DateTime" IncludeTimeValue="TRUE" StorageTZ="TRUE">${term.replace(
          /\//g,
          "-"
        )}T15:00:00Z</Value>
    </Lt>`;
export const camlOr = (query1: string, query2: string): string =>
  `<Or>
        ${query1}
        ${query2}
    </Or>`;
export const camlAnd = (query1: string, query2: string): string =>
  `<And>
        ${query1}
        ${query2}
    </And>`;
export const camlNestedOr = (conditions: string[]): string => {
  if (conditions.length === 0) return "";
  if (conditions.length === 1) return conditions[0];
  let camlQuery = conditions[0];
  for (let i = 1; i < conditions.length; i++) {
    camlQuery = `<Or>
                ${camlQuery}
                ${conditions[i]}
            </Or>`;
  }
  return camlQuery;
};
export const camlNestedAnd = (conditions: string[]): string => {
  if (conditions.length === 0) return "";
  if (conditions.length === 1) return conditions[0];
  let camlQuery = conditions[0];
  for (let i = 1; i < conditions.length; i++) {
    camlQuery = `<And>
                ${camlQuery}
                ${conditions[i]}
            </And>`;
  }
  return camlQuery;
};
export const camlChoiceMultipleText = (
  field: string,
  terms: string[]
): string => {
  if (terms.length === 1) {
    return camlCompareValueChoiceText(terms[0], field);
  } else if (terms.length === 2) {
    return camlOr(
      camlCompareValueChoiceText(terms[0], field),
      camlCompareValueChoiceText(terms[1], field)
    );
  } else {
    const creterias = terms.map((term) =>
      camlCompareValueChoiceText(term, field)
    );
    return camlNestedOr(creterias);
  }
};
export const camlChoiceMultipleNumber = (
  field: string,
  terms: number[]
): string => {
  if (terms.length === 1) {
    return camlEqNumber(terms[0], field);
  } else if (terms.length === 2) {
    return camlOr(camlEqNumber(terms[0], field), camlEqNumber(terms[1], field));
  } else {
    const creterias = terms.map((term) => camlEqNumber(term, field));
    return camlNestedOr(creterias);
  }
};
export const camlAndFinal = (conditions: string[]): string => {
  if (conditions.length === 0) return "";
  const nestedConditions = camlNestedAnd(conditions);
  const resultXml = `<Where>
            ${nestedConditions}
        </Where>`;
  return resultXml;
};
