import {
  Banner,
  Checkbox,
  useApi,
  useTranslate,
  reactExtension,
  useCartLines,
  List,
  ListItem,
  BlockSpacer,
  Pressable,
  useCustomer,
} from '@shopify/ui-extensions-react/checkout';
import { Button } from '@shopify/ui-extensions/checkout';
import React, { useState } from 'react';
import { saveCart } from '../../../web/savedCart';

export default reactExtension(
  'purchase.checkout.block.render',
  () => <Extension />,
);

function Extension() {
  const translate = useTranslate();
  const customerId = useCustomer().id;
  const [isSaved, setIsSaved] = useState(false);
  const [anySelected, setAnySelected] = useState(false);

  const cartLines = useCartLines();
  let cartLinesDict = Object.assign(...cartLines.map((cartLine, i) => ({[i]: cartLine})));
  
  var cartLinesSelectionList = [];

  const handleSave = () => {
    setIsSaved(true);
    var cartLinesToSave = cartLinesSelectionList.map((i) => cartLinesDict[i].merchandise?.id);
    var res = saveCart(customerId, cartLinesToSave);
    console.log("res");
    console.log(res);
    cartLinesSelectionList = [];
  };
  
  return (
    <>
      <Banner 
        title={translate(isSaved? 'cart_saved': 'save_cart')} 
        status={isSaved? 'success':'info'}
      >
        <>
        <List marker="none">
          {cartLines.map((cartLine, i) => 
            <Pressable key={i}>
              <Checkbox id={`checkbox ${i}`} key={i} name={`checkbox ${i}`}
              onChange={() => {
                setIsSaved(false);
                const idx = cartLinesSelectionList.indexOf(i);
                if (idx !== -1) {
                  cartLinesSelectionList.splice(idx, idx+1); 
                }
                else {
                  cartLinesSelectionList.push(i);
                }
                setAnySelected(cartLinesSelectionList.length !== 0);
              }}>
                <ListItem key={i}>{cartLine.merchandise.title}</ListItem>
              </Checkbox> 
            </Pressable> 
          )}
        </List>
        <BlockSpacer spacing="base" />
        <Button onPress={handleSave} disabled={isSaved || !anySelected}>
          {isSaved? "Saved": "Save"}</Button>
        </>
      </Banner>
    </>
    );
  }
  // const { extension } = useApi();
  // <Banner title="boa-home-task-AF">
// {translate('welcome', {target: extension.target})} */}
// {/* {translate('save_cart')}