pragma circom 2.0.0;

// out is 1 if in == a || in == b || in == c
template Contains3(a, b, c) {
    signal input in;
    signal output out;

    component eq1 = IsEqual();
    eq1.in[0] <== in;
    eq1.in[1] <== a;
    component eq2 = IsEqual();
    eq2.in[0] <== in;
    eq2.in[1] <== b;
    component eq3 = IsEqual();
    eq3.in[0] <== in;
    eq3.in[1] <== c;

    component or1 = OR();
    or1.a <== eq1.out;
    or1.b <== eq2.out;
    component or2 = OR();
    or2.a <== or1.out;
    or2.b <== eq3.out;

    or2.out ==> out;
}

// out is 1 if in == a || in == b
template Contains2(a, b) {
    signal input in;
    signal output out;

    component eq1 = IsEqual();
    eq1.in[0] <== in;
    eq1.in[1] <== a;
    component eq2 = IsEqual();
    eq2.in[0] <== in;
    eq2.in[1] <== b;

    component or1 = OR();
    or1.a <== eq1.out;
    or1.b <== eq2.out;
    
    or1.out ==> out;
}