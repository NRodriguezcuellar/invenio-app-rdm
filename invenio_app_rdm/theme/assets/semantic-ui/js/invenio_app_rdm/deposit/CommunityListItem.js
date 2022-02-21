import React from "react";
import { Field } from "formik";
import { Item, Button, Container, Label } from "semantic-ui-react";
import _truncate from "lodash/truncate";
import { Image } from "react-invenio-forms";

const SelectButton = ({ selected, standAlone, onSelect }) => {
  if (standAlone) return null;

  return (
    <Button
      content={selected ? "selected" : "select"}
      floated="right"
      positive={selected}
      onClick={() => onSelect()}
    />
  );
};

const DeselectButton = ({ onDeselect }) => (
  <Button icon="delete" floated="right" onClick={() => onDeselect()} />
);

export const CommunityListItem = ({ result, standAlone }) => {
  const metadata = result.metadata;

  const truncate = (string, length) => _truncate(string, { length });

  return (
    <Field>
      {({ form: { values, setFieldValue } }) => (
        <Item key={result.id} className="community-list-result-item">
          <Item.Image
            as={Image}
            size="tiny"
            src="/static/images/square-placeholder.png"
          />
          <Item.Content verticalAlign="top">
            <Item.Header>{truncate(metadata.title, 70)}</Item.Header>
            <Item.Description>
              {truncate(metadata.description, 150)}
            </Item.Description>
            <Item.Extra>{truncate(metadata.type, 50)}</Item.Extra>
          </Item.Content>

          <Container className="community-list-result-item-button-container">
            <SelectButton
              selected={values.chosenCommunity?.id === result.id}
              standAlone={standAlone}
              onSelect={() =>
                setFieldValue(
                  "chosenCommunity",
                  values.chosenCommunity?.id === result.id ? null : result
                )
              }
            />

            {standAlone && (
              <DeselectButton
                onDeselect={() => setFieldValue("chosenCommunity", null)}
              />
            )}
          </Container>
        </Item>
      )}
    </Field>
  );
};
